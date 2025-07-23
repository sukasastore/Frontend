// components/Logo.tsx
import Image from "next/image";
const Logo = ({ className = "",  }) => (
   <Image src="/assets/images/png/sukasa.png" alt="Logo" width={100} height={100} className={className} />
  );
  
  export default Logo;
  