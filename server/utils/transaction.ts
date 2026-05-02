// This file provides utility functions for managing generic transaction-like operations.
// These utilities can be used to encapsulate multi-step processes, ensuring atomicity
// or providing a structured way to handle a sequence of operations.

// Represents the status of a transaction.
export type TransactionStatus = 'pending' | 'success' | 'failed' | 'cancelled';

// A generic interface for a transaction step.
export interface TransactionStep<TResult = any> {
  name: string;
  execute: () => Promise<TResult>;
  rollback?: () => Promise<void>;
}

// Manages the execution of a series of transaction steps, with optional rollback on failure.
//
// @param steps An array of TransactionStep objects to execute in sequence.
// @returns A promise that resolves with the results of all successful steps, or rejects if any step fails.
export const executeTransaction = async <TResult = any>(
  steps: TransactionStep<TResult>[]
): Promise<TResult[]> => {
  const results: TResult[] = [];
  const completedSteps: TransactionStep<TResult>[] = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    try {
      console.log(`Executing transaction step: ${step.name}`);
      const result = await step.execute();
      results.push(result);
      completedSteps.push(step);
    } catch (error) {
      console.error(`Transaction step '${step.name}' failed:`, error);
      // Initiate rollback for all successfully completed steps
      for (let j = completedSteps.length - 1; j >= 0; j--) {
        const completedStep = completedSteps[j];
        if (completedStep.rollback) {
          try {
            console.log(`Rolling back step: ${completedStep.name}`);
            await completedStep.rollback();
          } catch (rollbackError) {
            console.error(
              `Rollback for step '${completedStep.name}' failed:`,
              rollbackError
            );
            // Log this, but continue with other rollbacks
          }
        }
      }
      throw new Error(`Transaction failed at step '${step.name}'. Rollback attempted.`);
    }
  }

  console.log('Transaction completed successfully.');
  return results;
};