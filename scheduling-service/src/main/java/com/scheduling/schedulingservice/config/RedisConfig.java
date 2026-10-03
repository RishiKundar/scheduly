package com.scheduling.schedulingservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    RedisCacheManager redisCacheManager(LettuceConnectionFactory lettuceConnectionFactory){
        RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .disableCachingNullValues()
                .entryTtl(Duration.ofSeconds(5))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(RedisSerializer.json()));
        redisCacheConfiguration.usePrefix();
        return RedisCacheManager.RedisCacheManagerBuilder.fromConnectionFactory(lettuceConnectionFactory)
                .cacheDefaults(redisCacheConfiguration).build();
    }

}
