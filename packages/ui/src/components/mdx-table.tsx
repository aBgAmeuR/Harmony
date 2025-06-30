import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/table"

type MdxTableProps = {
    content: Record<string, string>[];
}

export function MdxTable({ content }: MdxTableProps) {
    const keys = Object.keys(content[0]);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {keys.map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {content.map((row) => (
                    <TableRow key={Object.values(row).join('-')}>
                        {keys.map((key) => (
                            <TableCell key={key}>{row[key]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
