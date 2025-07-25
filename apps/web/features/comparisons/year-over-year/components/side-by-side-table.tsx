'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table";


import type { YearMetrics } from "../data/year-metrics";
import { calculatePercentageChange, getChangeIndicator } from "../utils/calculations";

type SideBySideTableProps = {
    metrics1: YearMetrics;
    metrics2: YearMetrics;
};

export function SideBySideTable({ metrics1, metrics2 }: SideBySideTableProps) {
    const rows = [
        { label: "Total Listening Time", val1: metrics1.totalListeningTime, val2: metrics2.totalListeningTime },
        { label: "Number of Streams", val1: metrics1.numStreams, val2: metrics2.numStreams },
        // Add more metrics
    ];


    return (
        <Card>
            <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Metric</TableHead>
                            <TableHead>{metrics1.year}</TableHead>
                            <TableHead>{metrics2.year}</TableHead>
                            <TableHead>Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row) => {
                            const change = calculatePercentageChange(row.val1, row.val2);
                            const indicator = getChangeIndicator(change);
                            return (
                                <TableRow key={row.label}>
                                    <TableCell>{row.label}</TableCell>
                                    <TableCell>{row.val1}</TableCell>
                                    <TableCell>{row.val2}</TableCell>
                                    <TableCell className={`text-${indicator.color}-500`}>{indicator.label}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
} 