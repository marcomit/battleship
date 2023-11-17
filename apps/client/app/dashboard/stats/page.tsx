import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page.header";

export default function Page() {
  return (
    <main>
      <PageHeader>
        <PageHeaderHeading>Home</PageHeaderHeading>
        <PageHeaderDescription>
          You can find your ELO and recent games
        </PageHeaderDescription>
      </PageHeader>
    </main>
  );
}
