import { Pressable, Text } from "react-native";

type PrimaryButtonProps = {
    title: string;
    onPress: () => void;
    disabled?: boolean;
};

const PrimaryButton = ({ title, onPress, disabled } : PrimaryButtonProps) => (
    <Pressable
        disabled={disabled}
        onPress={onPress}
        className={`
            px-4 py-3 rounded-xl items-center
            ${disabled ? "bg-blue-500/50" : "bg-blue-500"}
        `}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
    >
        <Text className="text-white text-lg font-semibold">{title}</Text>
    </Pressable>
);

export default PrimaryButton
