/* eslint-disable camelcase */
import DeviceInfo from 'react-native-device-info';

export const getDeviceInfos = async () => {
    try {
        const device_uniqueid = DeviceInfo.getUniqueID();
        const device_brand = DeviceInfo.getBrand();
        const device_buildnumber = DeviceInfo.getBuildNumber();
        const device_carrier = DeviceInfo.getCarrier();
        const device_locale_wire = DeviceInfo.getDeviceCountry();
        const device_deviceid = DeviceInfo.getDeviceId();
        const device_locale_os = DeviceInfo.getDeviceLocale();
        const device_locale_preferred = DeviceInfo.getPreferredLocales();
        const device_name = DeviceInfo.getDeviceName();
        const device_firstinstall = new Date(DeviceInfo.getFirstInstallTime());
        const device_last_local_ip = await DeviceInfo.getIPAddress();
        const device_lastupdate_app = new Date(DeviceInfo.getLastUpdateTime());
        const device_manufacturer = DeviceInfo.getManufacturer();
        const device_os = DeviceInfo.getSystemName();
        const device_os_version = DeviceInfo.getSystemVersion();
        const device_timezone = DeviceInfo.getTimezone();
        const device_is_emulator = DeviceInfo.isEmulator() ? 'true' : 'false';
        const device_type = DeviceInfo.getDeviceType();
    
        return {
            device_uniqueid,
            device_brand,
            device_buildnumber,
            device_carrier,
            device_locale_wire,
            device_deviceid,
            device_locale_os,
            device_locale_preferred,
            device_name,
            device_firstinstall,
            device_last_local_ip,
            device_lastupdate_app,
            device_manufacturer,
            device_os,
            device_os_version,
            device_timezone,
            device_is_emulator,
            device_type
        };
    } catch (e) {
        return {};
    }
};

