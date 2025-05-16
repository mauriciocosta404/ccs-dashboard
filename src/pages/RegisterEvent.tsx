import { useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import DropzoneComponent from "../components/form/form-elements/DropZone";
import Label from "../components/form/Label";
import { CalenderIcon } from "../icons";
import Flatpickr from "react-flatpickr";
import TextArea from "../components/form/input/TextArea";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";

export default function RegisterEvent() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Registrar Evento" />
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <DropzoneComponent />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <DefaultInputs />
          </div>
          <div className="space-y-6">
            <TextAreaInput />
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultInputs() {
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleDateChange = (date: Date[]) => {
    setDateOfBirth(date[0].toLocaleDateString()); // Handle selected date and format it
  };
  return (
    <ComponentCard title="Detalhes do evento">
      <div className="space-y-6">
    
        <div>
          <Label htmlFor="datePicker">Data de inicio</Label>
          <div className="relative w-full flatpickr-wrapper">
            <Flatpickr
              value={dateOfBirth} // Set the value to the state
              onChange={handleDateChange} // Handle the date change
              options={{
                dateFormat: "Y-m-d", // Set the date format
              }}
              placeholder="Select an option"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="datePicker">Data de termino</Label>
          <div className="relative w-full flatpickr-wrapper">
            <Flatpickr
              value={dateOfBirth} // Set the value to the state
              onChange={handleDateChange} // Handle the date change
              options={{
                dateFormat: "Y-m-d", // Set the date format
              }}
              placeholder="Select an option"
              className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <CalenderIcon className="size-6" />
            </span>
          </div>
        </div>
      </div>

      <Button className="lg:w-1/3 w-full">Gravar</Button>
    </ComponentCard>
  );
}

function TextAreaInput() {
  const [messageTwo, setMessageTwo] = useState("");
  return (
    <ComponentCard title="Textarea input field">
      <div className="space-y-6">
        <div>
          <Label htmlFor="input">Input</Label>
          <Input type="text" id="input" />
        </div>

        <div>
          <Label>Description</Label>
          <TextArea
            rows={3}
            value={messageTwo}
            error
            onChange={(value) => setMessageTwo(value)}
            hint="Please enter a valid message."
          />
        </div>
      </div>
    </ComponentCard>
  );
}
