"use client";

import { Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export interface SelectOption {
  name: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export const CustomSelect = ({ options, value, onChange }: CustomSelectProps) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:rounded-xl sm:py-2.5 sm:pl-4 sm:pr-12">
          <span className="block truncate">{selectedOption?.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Listbox.Options
          anchor="bottom" 
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm
                     transition duration-100 ease-in data-[leave]:opacity-0"
        >
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              className="group relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 data-[active]:bg-blue-50 data-[active]:text-blue-900"
              value={option.value}
            >
              <span className="block truncate group-data-[selected]:font-semibold">
                {option.name}
              </span>

              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 hidden group-data-[selected]:block">
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};