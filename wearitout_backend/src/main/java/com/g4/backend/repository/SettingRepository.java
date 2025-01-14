package com.g4.backend.repository;

import com.g4.backend.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface SettingRepository extends JpaRepository<Setting, Integer>{
    @Query("SELECT s.settingId, s.name FROM Setting s WHERE s.type.typeId = :typeId")
    List<Object[]> findNamesAndIdsByTypeId(@Param("typeId") int typeId);

    Setting findByName(String name);
    Setting findBySettingId(int settingId);
    Optional<Setting> findSettingByName(String name);
}
