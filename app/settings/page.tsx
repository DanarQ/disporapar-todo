import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Info, Users, Building, Mail, Phone } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Pengaturan
        </h1>
        <p className="text-muted-foreground">
          Pengaturan dan informasi aplikasi
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tentang Aplikasi
          </CardTitle>
          <CardDescription>
            Informasi tentang aplikasi Todo List Disporapar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Nama Aplikasi</p>
            <p className="text-sm text-muted-foreground">
              Disporapar Todo List
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Versi</p>
            <p className="text-sm text-muted-foreground">1.0.0</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Dibuat untuk</p>
            <p className="text-sm text-muted-foreground">
              Dinas Kepemudaan, Olahraga, dan Pariwisata
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Kontak Instansi
          </CardTitle>
          <CardDescription>
            Informasi kontak Dinas Kepemudaan, Olahraga, dan Pariwisata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Pimpinan</p>
              <p className="text-sm text-muted-foreground">Nama Kepala Dinas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                disporapar@example.go.id
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Telepon</p>
              <p className="text-sm text-muted-foreground">(021) 555-1234</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Alamat</p>
              <p className="text-sm text-muted-foreground">
                Jl. Merdeka No. 123, Kota Jakarta, 12345
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
