#ifndef __BEACON_LICENSE_MQH__
#define __BEACON_LICENSE_MQH__

#define VERIFY_URL "http://127.0.0.1:3000/api/licenses/verify"
#define HEARTBEAT_URL "http://127.0.0.1:3000/api/licenses/heartbeat"
#define LOGOUT_URL "http://127.0.0.1:3000/api/licenses/logout"

string g_session_token = "";
bool g_license_valid = false;

bool VerifyLicense()
{
   Print("Beacon License Verify");
   return true;
}

bool SendHeartbeat()
{
   return true;
}

void LogoutLicense()
{
}

#endif