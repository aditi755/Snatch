 const FormInput = ({...props }) => (
    <div className="w-full">
  
      <input
        {...props}
        className="w-full bg-transparent rounded-md border border-gray-300   py-[10px] px-5 text-graphite outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
      />
    </div>
  );

  export default FormInput
  