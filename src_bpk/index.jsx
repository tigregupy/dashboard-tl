import ForgeUI, { DashboardGadget, DashboardGadgetEdit, render, Text, TextField, useProductContext } from "@forge/ui";
import View from "./View";

const Edit = () => {
  const onSubmit = values => {
      return values
  };

  return (
    <DashboardGadgetEdit onSubmit={onSubmit}>
      <TextField name="name" label="Say hello to:" />
    </DashboardGadgetEdit>
  );
}

export const runView = render(
  <View/>
);

export const runEdit = render(<Edit/>)

i