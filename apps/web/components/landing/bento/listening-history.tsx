import type React from "react";

const ListeningHistory: React.FC = () => {
    const monthlyData = [45, 52, 38, 67, 89, 94, 78, 85, 92, 76, 88, 95];
    const maxValue = Math.max(...monthlyData);

    return (
        <div className="absolute inset-0 flex items-center justify-center p-3">
            <div className="h-[260px] w-[340px] rounded-lg border border-foreground/10 bg-card/60 p-4 backdrop-blur">
                <div className="mb-3 flex items-center justify-between border-foreground/10 border-b pb-2">
                    <h3 className="font-semibold text-xs">Listening History</h3>
                    <span className="text-2xs text-muted-foreground">2024 Timeline</span>
                </div>
                <div className="relative mb-3 h-[120px]">
                    <svg width="100%" height="100%" viewBox="0 0 308 120">
                        {[0, 25, 50, 75, 100].map((y) => (
                            <line
                                key={y}
                                x1="0"
                                y1={120 - (y * 120) / 100}
                                x2="308"
                                y2={120 - (y * 120) / 100}
                                stroke="currentColor"
                                strokeWidth="0.5"
                                opacity="0.2"
                            />
                        ))}
                        <polyline
                            points={monthlyData
                                .map((value, index) => {
                                    const x = (index * 308) / (monthlyData.length - 1);
                                    const y = 120 - (value / maxValue) * 100;
                                    return `${x},${y}`;
                                })
                                .join(" ")}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {monthlyData.map((value, index) => {
                            const x = (index * 308) / (monthlyData.length - 1);
                            const y = 120 - (value / maxValue) * 100;
                            const isHighlight = index === 11;
                            return (
                                <circle key={index} cx={x} cy={y} r={isHighlight ? 4 : 2} className={isHighlight ? "fill-primary stroke-primary" : "fill-background stroke-primary"} strokeWidth="2" />
                            );
                        })}
                        <path
                            d={`M0,120 ${monthlyData
                                .map((value, index) => {
                                    const x = (index * 308) / (monthlyData.length - 1);
                                    const y = 120 - (value / maxValue) * 100;
                                    return `L${x},${y}`;
                                })
                                .join(" ")} L308,120 Z`}
                            className="fill-primary/10"
                        />
                    </svg>
                </div>
                <div className="grid grid-cols-3 gap-2 rounded-md bg-primary p-2 text-primary-foreground">
                    <div className="text-center">
                        <div className="font-semibold text-xs">+23%</div>
                        <div className="text-2xs opacity-80">vs last year</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-xs">95h</div>
                        <div className="text-2xs opacity-80">this month</div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-xs">Dec</div>
                        <div className="text-2xs opacity-80">peak month</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListeningHistory;


