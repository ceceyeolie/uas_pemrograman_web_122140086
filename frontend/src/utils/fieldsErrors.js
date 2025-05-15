export default function FieldError({ name, errors }) {
  if (!errors[name]) return null;
  
  return (
    <span className="text-red-500 text-sm">
      {errors[name]}
    </span>
  );
};