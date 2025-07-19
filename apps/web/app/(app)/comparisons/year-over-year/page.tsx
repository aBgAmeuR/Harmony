import { Layout, LayoutContent, LayoutHeader } from "~/components/layouts/layout";

export default function ComparisonsYearOverYearPage() {
	return (
		<Layout>
			<LayoutHeader items={["Advanced", "Comparisons", "Year-over-Year"]} />
			<LayoutContent>
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<div className="aspect-video rounded-xl bg-muted/50" />
					<div className="aspect-video rounded-xl bg-muted/50" />
					<div className="aspect-video rounded-xl bg-muted/50" />
				</div>
				<div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
			</LayoutContent>
		</Layout>
	);
}
