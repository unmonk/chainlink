// import { Separator } from "../ui/separator"
// import { getUserStats } from "@/lib/actions/profiles"
// import { auth } from "@clerk/nextjs"
// import Image from "next/image"
// import { FC } from "react"
// import { leagueLogos } from "@/lib/config"

// interface ProfileStatsProps {
//   userId: string
// }

// const ProfileStats: FC<ProfileStatsProps> = async ({ userId }) => {
//   const stats = await getUserStats(userId)
//   return (
//     <div>
//       <h2 className="mb-2 text-xl font-bold">Stats</h2>
//       <div className="flex flex-col items-center justify-center rounded-md border p-2 ">
//         <h3 className="p-2 text-center text-xl">Wins By League</h3>
//         <div className="grid w-full grid-cols-3 gap-2 p-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
//           {stats.length > 0 ? (
//             stats?.map((stat) => (
//               <div
//                 key={stat.leagues}
//                 className="flex h-20 w-20 flex-col items-center pb-4"
//               >
//                 <Image
//                   src={leagueLogos[stat.leagues] || "images/alert-octagon.svg"}
//                   alt={stat.leagues}
//                   width={100}
//                   height={100}
//                   className="h-3/4 w-3/4 object-cover transition-all hover:scale-110"
//                 />
//                 <p className="min-y-12 text-center">
//                   {stat.leagues === "COLLEGE-FOOTBALL" ? "CFB" : stat.leagues}:{" "}
//                   {stat.win_count}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-center">No Stats Yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileStats
