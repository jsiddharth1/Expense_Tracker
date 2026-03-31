package com.example.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        // If the resource exists or is an API call, return it.
                        // Otherwise, return index.html for React routing.
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        } else if (resourcePath.startsWith("api/")) {
                            return null;
                        } else {
                            return new ClassPathResource("/static/index.html");
                        }
                    }
                });
    }
}
