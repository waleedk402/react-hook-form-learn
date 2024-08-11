import { useForm, useFieldArray } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";
const Form = () => {
  const form = useForm({
    defaultValues: {
      username: "bob",
      email: "",
      channel: "",
      social: {
        facebook: "",
        twitter: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    mode:"onTouched"
  });
  const { register, control, handleSubmit, formState, reset } = form;
  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });
  const { errors, isDirty, isValid, isSubmitting, isSubmitted } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };
  const onError = (errors) => {
    console.log(errors);
  };
  useEffect(() => {
    if (isSubmitted) {
      reset();
    }
  }, [isSubmitted, reset]);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          {<p className="error">{errors.username?.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i,
                message: "Invalid Email format",
              },
              validate: {
                notAdmin: (fieldValue) =>
                  fieldValue !== "admin@example.com" ||
                  "Enter a different email address",
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain is not supported"
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response=await fetch(`https://jsonplaceholder.typicode.com/users?email=${fieldValue}`)
                  const data=await response.json()
                  return !data.length || "Email already exists"
                }
              },
            })}
          />
          {<p className="error">{errors.email?.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            name="channel"
            {...register("channel", { required: "Channel is required" })}
          />
          {<p className="error">{errors.channel?.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="twitter">Twitter</label>
          <input
            type="text"
            id="twitter"
            name="twitter"
            {...register("social.twitter", { required: "Twitter is required" })}
          />
          {<p className="error">{errors.social?.twitter?.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input
            type="text"
            id="facebook"
            name="facebook"
            {...register("social.facebook", {
              required: "Facebook is required",
            })}
          />
          {<p className="error">{errors.social?.facebook?.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="primary-phone">Primary Phone Number</label>
          <input
            type="text"
            id="primary-phone"
            name="primary-phone"
            {...register("phoneNumbers.0", {
              required: "Primary Phone Number is required",
            })}
          />
          {<p className="error">{errors?.phoneNumbers?.[0]?.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="secondary-phone">Secondary Phone Number</label>
          <input
            type="text"
            id="secondary-phone"
            name="secondary-phone"
            {...register("phoneNumbers.1", {
              required: "Secondary Phone Number is required",
            })}
          />
          {<p className="error">{errors?.phoneNumbers?.[1]?.message}</p>}
        </div>
        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="form-control">
                <input type="text" {...register(`phNumbers.${index}.number`)} />

                {index > 0 && (
                  <>
                    {" "}
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                    {/* <button type="button" onClick={()=>replace(index,{number:""})}>Edit</button> */}
                  </>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append({ number: "" })}>
              Add phone number
            </button>
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            {...register("age", {
              required: "age is required",
              valueAsNumber: true,
            })}
          />
          {<p className="error">{errors?.age?.message}</p>}
        </div>

        <div className="form-control">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            {...register("dob", {
              required: "Date of Birth is required",
              valueAsDate: true,
            })}
          />
          {<p className="error">{errors.dob?.message}</p>}
        </div>

        <button disabled={!isDirty || !isValid || isSubmitting} type="submit">
          {isSubmitting ? "submitting..." : "Submit"}
        </button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};

export default Form;
