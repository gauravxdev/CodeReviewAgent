import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  try {
    // Get data from sessionStorage on the client side
    // This API now expects data to be stored in sessionStorage by the GitHub fetching process
    if (filePath) {
      // If path is provided, we need to find the file with that path in the stored files
      // This will actually be processed on the client side since we can't access sessionStorage here
      return NextResponse.json({ status: 'use_client_storage', path: filePath });
    } else {
      // For listing files, we'll also handle this on the client side
      return NextResponse.json({ status: 'use_client_storage' });
    }
  } catch (error) {
    console.error('Error accessing files:', error);
    return NextResponse.json(
      { error: 'Failed to access files' },
      { status: 500 }
    );
  }
}

// No longer need server-side file system listing function
