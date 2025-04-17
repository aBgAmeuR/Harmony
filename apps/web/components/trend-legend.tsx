"use client";

import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTrigger } from "@repo/ui/stepper";
import { useState } from "react";

const steps = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function TrendLegend() {
  const [currentStep, setCurrentStep] = useState(2)
  const month = steps[currentStep];

  return (
    <div>
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        {steps.map((step, index) => (
          <StepperItem key={step} step={index} className="not-last:flex-1">
            <StepperTrigger>
              <StepperIndicator className="p-4" asChild>{step}</StepperIndicator>
            </StepperTrigger>
            {index < steps.length - 1 && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}
