
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalCreateOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { amount, currency = 'USD', userId } = await req.json();
    
    console.log('Processing PayPal payment request:', { amount, currency, userId });

    // Get PayPal credentials
    const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Get PayPal access token
    const auth = btoa(`${clientId}:${clientSecret}`);
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const tokenData: PayPalTokenResponse = await tokenResponse.json();
    console.log('PayPal token obtained successfully');

    // Create PayPal order
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `GPODO Wallet Recharge - ${amount} points`,
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/dashboard?tab=wallet&payment=success`,
          cancel_url: `${req.headers.get('origin')}/dashboard?tab=wallet&payment=cancelled`,
        },
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const orderData: PayPalCreateOrderResponse = await orderResponse.json();
    console.log('PayPal order created:', orderData.id);

    // Store transaction record
    const { error: insertError } = await supabaseClient
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        amount: parseInt(amount),
        type: 'recharge',
        method: 'paypal',
        status: 'pending',
        paypal_order_id: orderData.id,
      });

    if (insertError) {
      console.error('Error storing transaction:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderData.id,
        approvalUrl: orderData.links.find(link => link.rel === 'approve')?.href,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('PayPal payment error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment processing failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
