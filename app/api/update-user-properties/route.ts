"use server";

import { NextRequest, NextResponse } from 'next/server';
import { Users, init } from "@kinde/management-api-js";

export async function PUT(request: NextRequest) {
  console.log('Received PUT request');
  const { userId, propertyKey, value } = await request.json();
  console.log('Request JSON parsed:', { userId, propertyKey, value });

  const params = {
    userId: userId,
    requestBody: {
      properties: {
        [propertyKey]: value
      }
    }
  }
  
  init();

  try {
    const response = await Users.updateUserProperties(params);
    console.log('Update response:', response);

    if (!response) {
      console.error('Failed to update user properties');
      return NextResponse.json({ error: 'Failed to update user properties' }, { status: 500 });
    }

    console.log('Preferences saved successfully.');
    return NextResponse.json({ message: 'Preferences saved successfully.' });
  } catch (error) {
    console.error('Error updating user properties:', error);
    return NextResponse.json({ error: 'Failed to update user properties' }, { status: 500 });
  }
}