import { useState } from "react";
import { Formik, Form } from "formik";
import { FieldWithMic, SpeechButton } from "../components/Speech";
import * as Yup from "yup";
import Hero from "./Hero";
import heroImage from "./../assets/img/login_hero1.webp";
import { UI_TEXT } from "./../utils/constants/ui";
import { loadStripe } from "@stripe/stripe-js";
import { getApiUrl } from "../utils/config";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const validationSchema = Yup.object({
    isAnonymous: Yup.string().required(),
    name: Yup.string().when("isAnonymous", {
        is: "no",
        then: (schema) => schema.required("Required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string()
        .email("Invalid email")
        .when("isAnonymous", {
            is: "no",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    amount: Yup.number()
        .typeError("Please enter a valid number")
        .min(1, "Minimum is 1")
        .required("Required"),
    message: Yup.string(),
});

const predefinedAmounts = [1, 3, 5, 10, 15, 20, 25];

const Donate = () => {
    const [customAmountSelected, setCustomAmountSelected] = useState(false);

    return (
        <main>
            <Hero
                heroImage={heroImage}
                title={UI_TEXT.donateHero.title}
                description={UI_TEXT.donateHero.description}
                showButton={false}
                className="min-h-[30vh]"
                contentClassName="max-w-md"
            />

            <div className="mx-auto max-w-xl px-6 py-12">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    🧋 Buy me a coffee
                </h1>

                <Formik
                    initialValues={{
                        isAnonymous: "no",
                        name: "",
                        email: "",
                        amount: "",
                        message: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        try {
                            const response = await fetch(
                                getApiUrl("/api/payment/create-checkout-session"),
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        amount: values.amount,
                                        name:
                                            values.isAnonymous === "no"
                                                ? values.name
                                                : "Anonymous",
                                        email:
                                            values.isAnonymous === "no"
                                                ? values.email
                                                : undefined,
                                    }),
                                }
                            );

                            const data = await response.json();

                            if (!data.id) {
                                throw new Error("Session creation failed");
                            }

                            const stripe = await stripePromise;
                            await stripe.redirectToCheckout({
                                sessionId: data.id,
                            });
                        } catch (error) {
                            console.error("Stripe checkout error:", error);
                            alert("Something went wrong. Please try again.");
                        }
                    }}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="space-y-6">
                            {/* Anonymous Toggle */}
                            <div>
                                <label className="block font-medium mb-1">
                                    Donate as:
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="isAnonymous"
                                            value="no"
                                            checked={
                                                values.isAnonymous === "no"
                                            }
                                            onChange={() =>
                                                setFieldValue(
                                                    "isAnonymous",
                                                    "no"
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        Use my name/email
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="isAnonymous"
                                            value="yes"
                                            checked={
                                                values.isAnonymous === "yes"
                                            }
                                            onChange={() =>
                                                setFieldValue(
                                                    "isAnonymous",
                                                    "yes"
                                                )
                                            }
                                            className="mr-2"
                                        />
                                        Anonymous
                                    </label>
                                </div>
                            </div>

                            {/* Conditionally show name/email */}
                            {values.isAnonymous === "no" && (
                                <>
                                    <FieldWithMic name="name" label="Your Name">
                                        <SpeechButton
                                            fieldName="name"
                                            setFieldValue={setFieldValue}
                                        />
                                    </FieldWithMic>

                                    <FieldWithMic
                                        name="email"
                                        label="Email"
                                        type="email"
                                    >
                                        <SpeechButton
                                            fieldName="email"
                                            setFieldValue={setFieldValue}
                                        />
                                    </FieldWithMic>
                                </>
                            )}

                            {/* Amount */}
                            <div>
                                <label className="block font-medium mb-2">
                                    Donation Amount (CAD)
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {predefinedAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            className={`px-4 py-2 border rounded ${
                                                values.amount === amount
                                                    ? "bg-green-600 text-white"
                                                    : "bg-white"
                                            }`}
                                            onClick={() => {
                                                setCustomAmountSelected(false);
                                                setFieldValue("amount", amount);
                                            }}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className={`px-4 py-2 border rounded ${
                                            customAmountSelected
                                                ? "bg-green-600 text-white"
                                                : "bg-white"
                                        }`}
                                        onClick={() => {
                                            setCustomAmountSelected(true);
                                            setFieldValue("amount", "");
                                        }}
                                    >
                                        Other
                                    </button>
                                </div>

                                {customAmountSelected && (
                                    <div>
                                        <label
                                            htmlFor="amount"
                                            className="block font-medium mb-1"
                                        >
                                            Enter custom amount
                                        </label>
                                        <input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            min="1"
                                            step="any"
                                            onChange={(e) =>
                                                setFieldValue(
                                                    "amount",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-full border rounded px-3 py-2"
                                            placeholder="e.g. 3.50"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <FieldWithMic
                                name="message"
                                label="Message (optional)"
                            >
                                <SpeechButton
                                    fieldName="message"
                                    setFieldValue={setFieldValue}
                                />
                            </FieldWithMic>

                            {/* Submit */}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                                >
                                    🧋 Donate
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </main>
    );
};

export default Donate;
