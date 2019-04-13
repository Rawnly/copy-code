import React from "react";
import Link from "next/link";

export default () => (
  <section>
    <Link href='/random'>
      <a className='button highlight'> Random </a>
    </Link>
  </section>
);
