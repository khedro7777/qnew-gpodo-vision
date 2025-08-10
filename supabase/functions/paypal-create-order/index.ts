
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const { amount, currency = 'USD', description, userId } = await req.json();
    
    console.log('Creating PayPal order:', { amount, currency, description, userId });

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

    const tokenData = await tokenResponse.json();

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
          description: description || 'Wallet recharge',
        }],
        application_context: {
          return_url: `${req.headers.get('origin')}/dashboard?payment=success`,
          cancel_url: `${req.headers.get('origin')}/dashboard?payment=cancelled`,
        },
      }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();

    // Store pending transaction
    const { error: insertError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        wallet_id: null, // Will be set when wallet is created
        type: 'recharge',
        amount: parseFloat(amount),
        description: description || 'PayPal wallet recharge',
        payment_method: 'PayPal',
        status: 'pending',
        payment_reference: orderData.id,
        metadata: { paypal_order_id: orderData.id }
      });

    if (insertError) {
      console.error('Error storing transaction:', insertError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderData.id,
        approvalUrl: orderData.links.find((link: any) => link.rel === 'approve')?.href,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('PayPal order creation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Order creation failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
