import Image from "next/image";

export function AppLogo() {
  return (
    <div className="flex items-center justify-center relative p-2">
      <Image src="/assets/images/png/sukasa.png" alt="logo" width={100} height={100} />
    </div>
  );
}
