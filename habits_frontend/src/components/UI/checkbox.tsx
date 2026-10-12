interface CheckboxProps{
    checked:boolean;
    setChecked:()=>void
}

export default function Checkbox({checked,setChecked}:CheckboxProps){
    return(
        <input type="checkbox" 
        checked={checked}
        onChange={setChecked}
        className="bg-[#67F0A5] border border-black rounded-md w-5 h-5"></input>
    )
}