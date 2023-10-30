import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminStats } from "@/lib/actions/admin-dashboard";

export default async function AdminStats({

}){
    const stats = await getAdminStats();



    return (
        <div className="mt-2 flex flex-col gap-2 rounded-md border">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <h1 className="text-primary p-4 text-xl">All Time Wins By League</h1>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>User</TableHead>
                <TableHead>NFL</TableHead>
                <TableHead>NBA</TableHead>
                <TableHead>MLB</TableHead>
                <TableHead>NHL</TableHead>
                <TableHead>CFB</TableHead>
                <TableHead>MBB</TableHead>
                <TableHead>WNBA</TableHead>
                <TableHead>NCAA</TableHead>
                <TableHead>OTHER</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
                {stats.map((stat) => (
                    <TableRow key={stat.user_id}>
                        <TableCell>
                            <div className="flex flex-col items-center justify-start">
                  <Avatar className="mx-2 h-7 w-7">
                    <AvatarImage
                      src={stat.imageUrl}
                      alt={stat.username || "User"}
                    />
                    <AvatarFallback>{stat.username}</AvatarFallback>
                  </Avatar> 
                  {stat.username}
                </div>
                        </TableCell>
                        <TableCell>{stat.NFL}</TableCell>
                        <TableCell>{stat.NBA}</TableCell>
                        <TableCell>{stat.MLB}</TableCell>
                        <TableCell>{stat.NHL}</TableCell>
                        <TableCell>{stat.COLLEGE_FOOTBALL}</TableCell>
                        <TableCell>{stat.MBB}</TableCell>
                        <TableCell>{stat.WNBA}</TableCell>
                        <TableCell>{stat.NCAA}</TableCell>
                        <TableCell>{stat.OTHER}</TableCell>
                        </TableRow>
                ))}
            </TableBody>
        
        </Table>

</div>
      </div>

    )

}