<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<json:property name="success" value="${success}" />
<c:if test="${msg != null}">
	<json:property name="msg" value="${msg}" />
</c:if>