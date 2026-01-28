import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjm5SpKOHGoYIuMuJYgqGxG16LpBBl0bozvIR8Q2njwJ0kmA9sdzah8X944dDsNszP/exec";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hoja = searchParams.get('hoja') || 'lista';

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?hoja=${hoja}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      redirect: "follow" // Vital para seguir el salto de Google
    });
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ status: "error", data: [], message: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
      redirect: "follow",
    });

    // Validamos si la respuesta es realmente un JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await response.json();
      return NextResponse.json(result);
    } else {
      // Si Google manda HTML, es un error de configuración
      const errorText = await response.text();
      console.error("Google devolvió HTML en lugar de JSON:", errorText);
      return NextResponse.json(
        { status: "error", message: "Google Script no está configurado como JSON o la URL es vieja." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}