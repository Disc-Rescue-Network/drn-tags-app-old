"use server";

import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init } from "@kinde/management-api-js";

export async function GET(request: NextRequest) {
  console.log('Received GET request');
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log('Parsed userId:', userId);

  if (!userId) {
    console.error('User ID is required');
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

const params = {
  userId: userId
}

init();
const response = await Users.refreshUserClaims(params);
console.log("response", response);
const userProperties = await Users.getUserPropertyValues(params);
console.log('User Properties:', userProperties);

  return NextResponse.json(userProperties);
}