
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { orderId, userId } = await req.json();
    
    console.log('Capturing PayPal payment:', { orderId, userId });

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

    const tokenData = await tokenResponse.json();

    // Capture the order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    const captureData = await captureResponse.json();
    console.log('PayPal capture response:', captureData);

    if (captureData.status === 'COMPLETED') {
      // Get the transaction amount from the capture data
      const amount = parseInt(captureData.purchase_units[0].payments.captures[0].amount.value);
      
      // Update transaction status
      const { error: updateError } = await supabaseClient
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          paypal_capture_id: captureData.purchase_units[0].payments.captures[0].id,
        })
        .eq('paypal_order_id', orderId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
      }

      // Update user's wallet balance
      const { error: balanceError } = await supabaseClient.rpc('update_wallet_balance', {
        user_id: userId,
        amount_to_add: amount
      });

      if (balanceError) {
        console.error('Error updating wallet balance:', balanceError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          status: 'completed',
          amount: amount,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Payment capture failed',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('PayPal capture error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment capture failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
