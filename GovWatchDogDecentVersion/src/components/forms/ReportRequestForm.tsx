import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ReportRequest } from '../../types';

const reportSchema = z.object({
  governmentLevel: z.enum(['Federal', 'Province']),
  province: z.string().optional().nullable(),
  reportType: z.enum(['Full Report', 'Summary Report', 'Specific Section']),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

interface ReportRequestFormProps {
  onSubmit: (data: ReportRequest) => void;
  isLoading: boolean;
}

export default function ReportRequestForm({ onSubmit, isLoading }: ReportRequestFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportRequest>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      governmentLevel: 'Federal',
      reportType: 'Full Report',
    },
  });

  const governmentLevel = watch('governmentLevel');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Government Level
          <select
            {...register('governmentLevel')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Federal">Federal</option>
            <option value="Province">Provincial</option>
          </select>
        </label>
        {errors.governmentLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.governmentLevel.message}</p>
        )}
      </div>

      {governmentLevel === 'Province' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Province
            <select
              {...register('province')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a province</option>
              <option value="Ontario">Ontario</option>
            </select>
          </label>
          {errors.province && (
            <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report Type
          <select
            {...register('reportType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Full Report">Full Report</option>
            <option value="Summary Report">Summary Report</option>
            <option value="Specific Section">Specific Section</option>
          </select>
        </label>
        {errors.reportType && (
          <p className="mt-1 text-sm text-red-600">{errors.reportType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Your Name
          <input
            type="text"
            {...register('userName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </label>
        {errors.userName && (
          <p className="mt-1 text-sm text-red-600">{errors.userName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Email
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="john@company.com"
          />
        </label>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Generating Report...' : 'Generate Report'}
      </button>
    </form>
  );
}