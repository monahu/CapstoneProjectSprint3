import React from "react";
import { ErrorMessage, Field } from "formik";

const FieldWithMic = ({ name, type, children }) => (
    <div className="space-y-1">
        <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
        >
            {name.charAt(0).toUpperCase() + name.slice(1)}
        </label>
        <div className="relative">
            <Field
                id={name}
                name={name}
                type={type}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {children}
        </div>
        <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-red-600"
        />
    </div>
);

export default FieldWithMic;
