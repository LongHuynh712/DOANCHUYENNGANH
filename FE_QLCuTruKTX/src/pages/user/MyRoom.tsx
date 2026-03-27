import axios from "axios";
import { useEffect, useState } from "react";
import { StudentProfile } from "../../types/student";
import { TenantInfo } from "../../types/tenancy";

export default function MyRoom() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const sinhVienId = localStorage.getItem("sinhVienId");

  useEffect(() => {
    async function fetchData() {
      try {
        const profileRes = await axios.get<StudentProfile>(
          `https://localhost:7122/api/students/${sinhVienId}`
        );

        setProfile(profileRes.data);

        if (!profileRes.data.roomId) {
          setLoading(false);
          return;
        }

        const tenantsRes = await axios.get<TenantInfo[]>(
          `https://localhost:7122/api/tenancy/room/${profileRes.data.roomId}`
        );

        setTenants(tenantsRes.data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }

    fetchData();
  }, [sinhVienId]);

  if (loading)
    return (
      <div className="text-white text-center p-6 animate-pulse">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="text-white p-6 space-y-8">

      {/* ===================================================
          CARD THÔNG TIN PHÒNG
      =================================================== */}
      <div className="
        bg-gradient-to-br from-[#1e1b4b] to-[#312e81]
        p-6 rounded-2xl shadow-xl
        border border-purple-500/20
        relative overflow-hidden
      ">
        <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full"></div>

        <h2 className="text-2xl font-bold relative z-10">
          Phòng của tôi
        </h2>

        {!profile?.roomId ? (
          <p className="mt-4 text-gray-300 relative z-10">
            Bạn hiện chưa được gán phòng. Vui lòng liên hệ Ban quản lý KTX.
          </p>
        ) : (
          <div className="relative z-10 mt-4">
            <p className="text-lg">
              <span className="text-purple-300 font-semibold">Mã phòng:</span>{" "}
              {profile.roomId}
            </p>
          </div>
        )}
      </div>

      {/* Nếu chưa có phòng thì không hiển thị danh sách */}
      {!profile?.roomId ? null : (
        <>
          {/* ===================================================
              DANH SÁCH NGƯỜI Ở TRONG PHÒNG
          =================================================== */}
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Bạn cùng phòng
            </h3>

            <div className="
              bg-[#15182c]/70 backdrop-blur-xl
              border border-purple-500/20
              p-5 rounded-2xl shadow-lg
              space-y-4
            ">
              {tenants.length === 0 ? (
                <p className="text-gray-400">Phòng hiện chưa có ai khác.</p>
              ) : (
                tenants.map((t) => (
                  <div
                    key={t.id}
                    className="
                      flex items-center gap-4
                      bg-white/5 p-4 rounded-xl border border-white/10
                      hover:bg-white/10 transition
                    "
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                      {t.student.fullName.charAt(0)}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="font-semibold">{t.student.fullName}</p>
                      <p className="text-sm text-gray-300">
                        MSSV: {t.student.studentId}
                      </p>
                      <p className="text-sm text-gray-400">
                        Lớp: {t.student.className}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
