import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Component() {
  return (
    <div className="grid min-h-screen w-full">
      <main className="flex flex-1 flex-col h-3/5 gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
        </div>
        <Card className="mr-4">
          <CardHeader>
            <CardTitle>UDisc Display Name</CardTitle>
            <CardDescription>
              Used to identify your scores on UDisc Live for the tags season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder="UDisc Display Name" />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
