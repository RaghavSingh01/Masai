
interface Device {
  specifications(): string;
}

class AppleLaptop implements Device {
  specifications(): string {
    return "Apple Laptop: M-series chip, macOS, Retina display";
  }
}

class ApplePhone implements Device {
  specifications(): string {
    return "Apple Phone: A-series chip, iOS, Face ID";
  }
}

class SamsungLaptop implements Device {
  specifications(): string {
    return "Samsung Laptop: Intel/AMD, Windows, AMOLED display";
  }
}

class SamsungPhone implements Device {
  specifications(): string {
    return "Samsung Phone: Exynos/Snapdragon, Android, AMOLED";
  }
}

interface DeviceFactory {
  createDevice(type: "laptop" | "phone"): Device;
}

class AppleFactory implements DeviceFactory {
  createDevice(type: "laptop" | "phone"): Device {
    if (type === "laptop") return new AppleLaptop();
    return new ApplePhone();
  }
}

class SamsungFactory implements DeviceFactory {
  createDevice(type: "laptop" | "phone"): Device {
    if (type === "laptop") return new SamsungLaptop();
    return new SamsungPhone();
  }
}

(function main() {
  const appleFactory: DeviceFactory = new AppleFactory();
  const samsungFactory: DeviceFactory = new SamsungFactory();

  const appleLaptop = appleFactory.createDevice("laptop");
  const samsungPhone = samsungFactory.createDevice("phone");

  console.log(appleLaptop.specifications());
  console.log(samsungPhone.specifications());
})();