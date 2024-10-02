export const View = () => {
    const { extensionContext: { gadgetConfiguration } } = useProductContext();
  
    return (
      <DashboardGadget>
        <Text
          content={`Hello ${gadgetConfiguration.name || "world"}.`}
        />
      </DashboardGadget>
    );
  };