<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<json:object>
	<c:import url="../success.jsp" charEncoding="UTF-8" />
	<json:property name="total" value="${fn:length(solutions)}" />
	<json:array name="solutions" var="s" items="${solutions}">
		<json:property value="${s}" />
	</json:array>
</json:object>