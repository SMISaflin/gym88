// app/api/midtrans/token/route.ts
import { NextResponse } from "next/server";
// @ts-ignore
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false, // Set 'true' jika sudah Production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request: Request) {
  try {
    const { name, email, phone, packageTitle, amount } = await request.json();

    const orderId = `GYM88-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: orderId,
          price: amount,
          quantity: 1,
          name: `Paket Gym 88: ${packageTitle}`,
        },
      ],
      customer_details: {
        first_name: name,
        email: email,
        phone: phone,
      },
    };

    // Minta Snap Token dari Midtrans
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      success: true,
      snapToken: transaction.token,
      orderId: orderId,
    });
  } catch (error: any) {
    console.error("Midtrans Token Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}