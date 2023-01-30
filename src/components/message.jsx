import Image from "next/image";

export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-6 border-b-2 rounded-lg">
      <div className="flex items-center gap-3">
        <Image className="w-10 rounded-full" src={avatar} width={40} height={40} alt="アバター" />
        <h2 className="font-bold text-sm">{username}</h2>
      </div>
      <div className="mt-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
