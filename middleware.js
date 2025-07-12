
// THIS MIDDELWARE IS RUN ON ALL HTTP REQUESTS
export default async function middelware(request){
    const token=request.cookies.get('token')?.value;
  // NOW JWT VERIFY BLAH BLAH!
}