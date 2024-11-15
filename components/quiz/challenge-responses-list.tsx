import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  TableHeader,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { QuizResults } from "@/convex/quiz";

export default function ChallengeResponsesList({
  quiz,
}: {
  quiz: QuizResults;
}) {
  return quiz.responses.length === 0 ? (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No responses yet</p>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Wager</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quiz.responses
              .sort((a, b) => b.wager - a.wager)
              .map((response) => (
                <TableRow key={response._id}>
                  <Link href={`/u/${response.user.name}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={response.user.image}
                            alt={response.user.name}
                          />
                          <AvatarFallback>
                            {response.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{response.user.name}</span>
                      </div>
                    </TableCell>
                  </Link>
                  <TableCell>
                    {
                      quiz.quiz.options.find(
                        (opt) => opt.id === response.selectedOptionId
                      )?.text
                    }
                  </TableCell>
                  <TableCell>🔗{response.wager}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
