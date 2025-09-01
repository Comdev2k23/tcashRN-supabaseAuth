import { supabase } from '@/lib/Auth';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface SignOutButtonProps {
  onSignOut?: () => void;
  variant?: 'default' | 'minimal' | 'icon' | 'text';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: object;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ 
  onSignOut, 
  variant = 'default',
  size = 'medium',
  className,
  style 
}) => {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async (event?: GestureResponderEvent) => {
    // Prevent event bubbling if needed
    event?.stopPropagation();
    
    // Confirm before signing out
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Cancel pressed")
        },
        { 
          text: "Sign Out", 
          onPress: async () => {
            setLoading(true);
            try {
              console.log("Attempting to sign out...");
              
              const { error } = await supabase.auth.signOut();
              
              if (error) {
                console.error("Sign out error:", error);
                Alert.alert("Sign Out Error", error.message);
                return;
              }
              
              console.log("Sign out successful");
              
              // Call the optional callback
              if (onSignOut) {
                onSignOut();
                router.replace('/(auth)')
              }
              
            } catch (error) {
              console.error("Unexpected sign out error:", error);
              Alert.alert("Error", "An unexpected error occurred during sign out.");
            } finally {
              setLoading(false);
            }
          } 
        }
      ],
      { cancelable: true }
    );
  };

  // Size styles
  const sizeStyles = {
    small: {
      padding: 2,
      fontSize: 14,
      iconSize: 16,
    },
    medium: {
      padding: 12,
      fontSize: 16,
      iconSize: 20,
    },
    large: {
      padding: 16,
      fontSize: 18,
      iconSize: 24,
    },
  };

  // Variant styles
  const variantStyles = {
    default: {
      backgroundColor: '#EF4444',
      textColor: '#FFFFFF',
      borderColor: 'transparent',
    },
    minimal: {
      backgroundColor: 'transparent',
      textColor: '#EF4444',
      borderColor: '#EF4444',
    },
    icon: {
      backgroundColor: 'transparent',
      textColor: '#EF4444',
      borderColor: 'transparent',
    },
    text: {
      backgroundColor: 'transparent',
      textColor: '#EF4444',
      borderColor: 'transparent',
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  // Render icon-only button
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={handleSignOut}
        disabled={loading}
        style={[
          styles.button,
          {
            padding: currentSize.padding,
            backgroundColor: currentVariant.backgroundColor,
            borderWidth: 1,
            borderColor: currentVariant.borderColor,
            borderRadius: 8,
          },
          style,
        ]}
        accessibilityLabel="Sign out"
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator size="small" color={currentVariant.textColor} />
        ) : (
          <LogOut size={currentSize.iconSize} color={currentVariant.textColor} />
        )}
      </TouchableOpacity>
    );
  }

  // Render text-only button
  if (variant === 'text') {
    return (
      <TouchableOpacity
        onPress={handleSignOut}
        disabled={loading}
        style={[
          styles.button,
          {
            padding: currentSize.padding,
            backgroundColor: currentVariant.backgroundColor,
          },
          style,
        ]}
        accessibilityLabel="Sign out"
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator size="small" color={currentVariant.textColor} />
        ) : (
          <Text style={[
            styles.text,
            {
              fontSize: currentSize.fontSize,
              color: currentVariant.textColor,
            }
          ]}>
            Sign Out
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // Render default or minimal button with icon and text
  return (
    <TouchableOpacity
      onPress={handleSignOut}
      disabled={loading}
      style={[
        styles.button,
        {
          padding: currentSize.padding,
          backgroundColor: currentVariant.backgroundColor,
          borderWidth: variant === 'minimal' ? 1 : 0,
          borderColor: currentVariant.borderColor,
          borderRadius: 8,
        },
        style,
      ]}
      accessibilityLabel="Sign out"
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.textColor} />
      ) : (
        <View style={styles.buttonContent}>
          <LogOut 
            size={currentSize.iconSize} 
            color={currentVariant.textColor} 
            style={styles.icon} 
          />
          <Text style={[
            styles.text,
            {
              fontSize: currentSize.fontSize,
              color: currentVariant.textColor,
            }
          ]}>
            Sign Out
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});

export default SignOutButton;