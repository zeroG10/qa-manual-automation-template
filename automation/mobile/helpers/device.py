import subprocess


def adb(*args: str) -> str:
    return subprocess.check_output(["adb", *args], text=True)


def adb_install(apk_path: str) -> None:
    subprocess.check_call(["adb", "install", "-r", apk_path])


def adb_uninstall(package: str) -> None:
    subprocess.call(["adb", "uninstall", package])


def xcrun_simctl(*args: str) -> str:
    return subprocess.check_output(["xcrun", "simctl", *args], text=True)
