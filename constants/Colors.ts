import { StyleSheet } from 'react-native';

export const buttonBorderWidth = 1;
export const buttonBorderRadius = 15;

export interface ThemeColors {
    green1: string;
    green2: string;
    backgroundColor: string;
    mainDisplaybackgroundColor: string;
    textColor: string;
    inputElementBorderColor: string;
    selectorBackground: string;
}

export const themeColors = {
    light: {
        green1: '#9AB286',
        green2: '#47614d',
        backgroundColor: '#F1F1F1',
        mainDisplaybackgroundColor: '#E3E3E3',
        textColor: '#686868',
        inputElementBorderColor: '#999999',
        selectorBackground: '#FFFFFF',
    },
    dark: {
        green1: '#9AB286',
        green2: '#528b5f',
        backgroundColor: '#3D403E',
        mainDisplaybackgroundColor: '#343434',
        textColor: '#CFCFCF',
        inputElementBorderColor: '#999999',
        selectorBackground: '#5a5a5a',
    },
} as const;

export function getColors(darkModeActive: boolean): ThemeColors {
    return darkModeActive ? themeColors.dark : themeColors.light;
}

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundColor, margin: '5%', gap: "5%" },
    inputContainer: { backgroundColor: colors.mainDisplaybackgroundColor, borderRadius: buttonBorderRadius, overflow: 'visible', alignItems: 'center', height: '60%', width: '100%' },
    camera: { borderRadius: buttonBorderRadius, overflow: 'hidden', height: '100%', width: '100%' },
    buttonContainer: { position: 'absolute', zIndex: 10, width: 50, height: 50, borderRadius: 999, overflow: 'hidden' },
    manualInputSelector: { top: 20, left: 20, position: 'absolute', zIndex: 10, padding: 7, borderRadius: 999, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.selectorBackground },
    cameraDirectionSwitcher: { top: 20, right: 20, position: 'absolute', padding: 7, zIndex: 10, backgroundColor: colors.selectorBackground, borderRadius: 999 },
    cameraInputSelector: { position: 'absolute', top: 20, left: 20, padding: 7, zIndex: 10, backgroundColor: colors.selectorBackground, borderRadius: 999 },
    homeButton: { padding: 6, zIndex: 10 },
    detailsButton: { position: 'absolute', flexDirection: 'row', bottom: 20, right: 20, padding: 8, zIndex: 10, borderRadius: 999, borderWidth: 1, alignItems: 'center', borderColor: colors.green2, backgroundColor: colors.mainDisplaybackgroundColor },
    detailsButtonText: { color: colors.green2, fontSize: 18, fontWeight: '600', margin: 'auto', paddingLeft: 5, paddingRight: 5 },
    manualInputContainer: { flex: 1, flexDirection: 'row', backgroundColor: colors.mainDisplaybackgroundColor, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    manualInputButton: { backgroundColor: colors.green2, color: 'white', borderRadius: 999, padding: 8 },
    textInputManual: { fontSize: 18, fontWeight: '700', width: 220, height: 'auto', backgroundColor: colors.mainDisplaybackgroundColor, borderColor: '#959595', borderWidth: buttonBorderWidth, borderRadius: buttonBorderRadius, color: colors.textColor, padding: 11, textAlign: 'center' },
    animalSelectDropdownContainer: { minHeight: 10, height: "7%" },
    animalSelectDropdown: { width: 180, backgroundColor: colors.backgroundColor, borderRadius: buttonBorderRadius },
    animalSelectDropdownItem: { backgroundColor: colors.backgroundColor, width: 180 },
    welcomeInfoText: { color: colors.textColor, fontSize: 14 },
    productTitleText: { fontSize: 40, fontWeight: '800', color: colors.green2 },
    warningHeaderText: { fontSize: 25, fontWeight: '900' },
    warningContentText: { paddingTop: 8, marginTop: 8, borderTopWidth: 1, borderColor: '#b3b3b3', fontSize: 20, fontWeight: '600', color: colors.textColor },
    detailsTitle: { color: colors.green2, fontSize: 50, fontWeight: '800', marginBottom: 5 },
    detailsSubHeader: { fontSize: 25, fontWeight: '900' },
    detailsIngredientText: { color: colors.textColor, fontSize: 25, fontWeight: '500' },
    detailsInfoText: { color: colors.textColor, fontSize: 18, marginBottom: 15, marginTop: 5 },
    scanningButton: { backgroundColor: colors.green1, borderRadius: 999, height: 'auto', width: 'auto', padding: 12 },
    settingsButton: { backgroundColor: colors.green1, borderRadius: 999, position: 'absolute', padding: 8, height: 'auto', width: 'auto' },
    disclaimerText: { fontSize: 14, color: '#959595' },
    logoWrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
    petCreationSubHeader: { color: colors.textColor, fontSize: 19, fontWeight: '600', alignSelf: 'flex-end', marginRight: 10 },
    settingsGridElement: { width: '50%', alignItems: 'center' },
    settingsGridElementContainer: { flexDirection: 'row', alignItems: 'center', margin: 10 },
    animalCreateDropdown: { borderRadius: buttonBorderRadius, borderColor: colors.inputElementBorderColor, width: '50%', backgroundColor: colors.mainDisplaybackgroundColor },
    animalCreateDropdownItem: { borderColor: colors.inputElementBorderColor, width: '50%', backgroundColor: colors.mainDisplaybackgroundColor },
    closeModalButton: { height: '8%', backgroundColor: colors.green1, width: '100%', alignItems: 'center', paddingTop: 8 },
    settingElementContainer: { width: '94%', backgroundColor: colors.mainDisplaybackgroundColor, padding: 5, borderRadius: 15, margin: '3%' },
});