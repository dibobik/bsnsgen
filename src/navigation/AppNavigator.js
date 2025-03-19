import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import IdeaGeneratorScreen from '../screens/IdeaGeneratorScreen';
import TaskPlanner from '../screens/TaskPlanner';
import FinanceTracker from '../screens/FinanceTracker';
import MarketingTools from '../screens/MarketingTools';
import StartScreen from '../screens/StartScreen';
import {LoginScreen} from "../screens/LoginScreen";
import {RegisterScreen} from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator({initialRouteName= 'Start'}) {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName= {initialRouteName} screenOptions={{ headerShown: false }} >

                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen}/>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="IdeaGenerator" component={IdeaGeneratorScreen} />
                <Stack.Screen name="TaskPlanner" component={TaskPlanner} />
                <Stack.Screen name="FinanceTracker" component={FinanceTracker} />
                <Stack.Screen name="MarketingTools" component={MarketingTools} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
