import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DefaultHeaderLeft from "src/Components/Header/DefaultHeaderLeft";
import AddCarPage from "src/Screens/Property/AddCarPage";
import CreateVisitPage from "src/Screens/Visit/CreateVisitPage";
import VisitsScreen from "src/Screens/Visit/VisistsScreen";
import MyPropertyDetails from "../../Screens/Property/MyPropertyDetails";
import { headerTitleStyle } from "../../Screens/Service/HeaderTitleStyle";
import { useTabStyle } from "../../Services/hooks/NavigationTabStyle";
import { useTranslation } from "../../Services/hooks/useTranslation";

const VisitStack = createNativeStackNavigator();

export default function VisitStackScreen() {
    const { translate } = useTranslation();
    const isAdmin = true; // Replace with your actual logic
    useTabStyle();
  
    return (
      <VisitStack.Navigator>
        {isAdmin ? (
          <VisitStack.Screen
            name="VisitsScreen"
            component={VisitsScreen}
            options={{
              title: translate("New visit"),
              headerTitleStyle: headerTitleStyle,
              headerTitleAlign: "center",
            }}
          />
        ) : (
          <VisitStack.Screen
            name="NewVisit"
            component={CreateVisitPage}
            options={{
              title: translate("New visit"),
              headerTitleStyle: headerTitleStyle,
              headerTitleAlign: "center",
            }}
          />
        )}
  
        <VisitStack.Screen
          name="MyPropertiesDetails"
          component={MyPropertyDetails}
          options={{
            headerShown: false,
            headerTitleAlign: "center",
          }}
        />
  
        <VisitStack.Screen
          name="AddCarPage"
          component={AddCarPage}
          options={{
            headerLeft: () => <DefaultHeaderLeft />,
            title: translate("Add car"),
            headerTitleStyle: headerTitleStyle,
            headerTitleAlign: "center",
          }}
        />
      </VisitStack.Navigator>
    );
  }
  