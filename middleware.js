
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; //jsonwebtoken official library doesent support edge!

// THIS MIDDELWARE IS RUN ON ALL HTTP REQUESTS
export default async function middelware(request) {
    const token = request.cookies.get('token')?.value; // this gets exact value of the JWT TOKEN console.log(token)

     const path=request.nextUrl.pathname;

     // exclude static assets
     if (
  path.startsWith('/_next') ||
  path.startsWith('/static') ||
  path.startsWith('/favicon.ico') ||
  path.startsWith('/robots.txt') ||
  path.startsWith('/sitemap') ||
  path.startsWith('/api') || // <-- add this for API routes
  path.startsWith('/public') || // <-- add this if you use /public assets
  path.endsWith('.svg') ||
  path.endsWith('.png') ||
  path.endsWith('.jpg') ||
  path.endsWith('.css') ||
  path.endsWith('.js')
) {
  return NextResponse.next();
}


   
  // if user enteres signup page or changepassword page let the request continue

    if(path === '/signup' || path === '/change-password'){
        return NextResponse.next();
    }


    // if token doesent exist, and path IS NOT /login, redirect user to login, otherwise if hes already there then continue the request
    if(!token){
        if(path !== '/login')
        return NextResponse.redirect (new URL('/login',request.url))  // console.log(request.nextUrl.path) gives paths like /login, /dashboard , /admin etc
        return NextResponse.next();

    }



    try{
        const secret = new TextEncoder().encode(process.env.SECRET) // required for jose  
        
        const isOK= await jwtVerify(token,secret);

        // if jwt is ok and user tries to enter /login, redirect him to home as hes already logged in
        // otherwise let the request continue

        if(isOK && path === '/login'){
            return NextResponse.redirect (new URL('/',request.url))
        }

        return NextResponse.next();
    }

    catch(err){
        // if jwt verification fails (invalid/broken url), redirect user to /login
        return NextResponse.redirect (new URL('/login',request.url))

    }
   

}

