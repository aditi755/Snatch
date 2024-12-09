  import Image from "next/image";
  import Link from 'next/link';

  export default function Home() {
    return (
      <div className="h-screen bg-smoke flex gap-4 justify-center items-center sm:flex-col overflow-hidden">
       
         <p className="text-5xl mx-auto text-electric-blue">Welcome to Snatch</p>  

          <p>
          <Link className=" text-2xl" href="/signup">Click here: Signup page</Link>
          </p>
      
      </div>
    );
  }
