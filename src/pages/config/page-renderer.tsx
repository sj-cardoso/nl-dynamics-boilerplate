import { useNavigation } from "@/hooks/useNavigation";

export const PageRenderer = () => {
  const { getCurrentPageComponent } = useNavigation();
  const CurrentPage = getCurrentPageComponent();

  return <CurrentPage />;
};
