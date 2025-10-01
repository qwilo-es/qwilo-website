import { AmbientColor } from '@/components/decorations/ambient-color';
import DynamicZoneManager from '@/components/dynamic-zone/manager';
import { MotionProvider } from '@/components/motion-provider';

export default function PageContent({ pageData }: { pageData: any }) {
  const dynamicZone = pageData?.dynamic_zone;
  return (
    <MotionProvider>
      <div className="relative overflow-hidden w-full">
        <AmbientColor />
        {dynamicZone && (
          <DynamicZoneManager
            dynamicZone={dynamicZone}
            locale={pageData.locale}
          />
        )}
      </div>
    </MotionProvider>
  );
}
